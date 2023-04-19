import { Project, ts } from "ts-morph";
import * as fs from "fs";
import * as path from "path";

const routesObject: { [folder: string]: { method: string; path: string }[] } = {};

function removeQuotes(str: string): string {
    return str.replace(/^['"]|['"]$/g, "");
}


function extractInfo(filePath: string) {
    const project = new Project({
        tsConfigFilePath: path.join(path.dirname(filePath), "tsconfig.json"),
    });
    const sourceFile = project.addSourceFileAtPath(filePath);
    const variableDeclarationsE = sourceFile.getVariableDeclarations();

    const expressInstance = variableDeclarationsE.find((variable) => {
        return variable.getText().includes("express");
    });

    if (!expressInstance) {
        return;
        //   throw new Error("Express instance not found");
    }

    const expressInstanceName = expressInstance.getName();
    const imports = sourceFile.getImportDeclarations();
    const variableDeclarations = sourceFile.getVariableDeclarations();
    const callExpressions = sourceFile.getDescendantsOfKind(ts.SyntaxKind.CallExpression);

    const routes: { method: string; path: string }[] = [];
    const httpMethods = ["get", "post", "put", "delete", "patch", "options", "head"];
    callExpressions.forEach((call) => {
        const expression = call.getExpression();
        if (expression.getText().includes(".")) {
            const routeMethod = expression.getText().split(".")[1];
            const routeArgs = call.getArguments();
            if (routeArgs.length > 0 && httpMethods.includes(routeMethod)) {
                routes.push({
                    method: routeMethod,
                    path: removeQuotes(routeArgs[0].getText()),
                });
            }
        }
    });

    return routes;
}

// function extractInfo(filePath: string) {
//   const project = new Project({
//     tsConfigFilePath: path.join(path.dirname(filePath), "tsconfig.json"),
//   });
//   const sourceFile = project.addSourceFileAtPath(filePath);
//   const variableDeclarationsE = sourceFile.getVariableDeclarations();

//   const expressInstance = variableDeclarationsE.find((variable) => {
//     return variable.getText().includes("express");
//   });

//   if (!expressInstance) {
//     // throw new Error("Express instance not found");
//     return;
//   }

//   const expressInstanceName = expressInstance.getName();
//   const imports = sourceFile.getImportDeclarations();
//   const variableDeclarations = sourceFile.getVariableDeclarations();
//   const callExpressions = sourceFile.getDescendantsOfKind(ts.SyntaxKind.CallExpression);

//   const routes: string[] = [];
//   const httpMethods = ["get", "post", "put", "delete", "patch", "options", "head"];
//   callExpressions.forEach((call) => {
//     const expression = call.getExpression();
//     if (expression.getText().includes(".")) {
//       const routeMethod = expression.getText().split(".")[1];
//       const routeArgs = call.getArguments();
//       if (routeArgs.length > 0 && httpMethods.includes(routeMethod)) {
//         routes.push(removeQuotes(routeArgs[0].getText()));
//       }
//     }
//   });

//   const routesArray: { method: string; path: string }[] = [];
//   callExpressions.forEach((call) => {
//     const expression = call.getExpression();
//     if (expression.getText().includes(".")) {
//       const routeMethod = expression.getText().split(".")[1];
//       const routeArgs = call.getArguments();
//       if (routeArgs.length > 0 && httpMethods.includes(routeMethod)) {
//         routesArray.push({
//           method: routeMethod,
//           path: removeQuotes(routeArgs[0].getText()),
//         });
//       }
//     }
//   });

//   return routesArray;
// }

function processFile(filePath: string) {
    console.log(filePath);
    const routes = extractInfo(filePath) || [];
    routesObject[path.dirname(filePath)] = routesObject[path.dirname(filePath)] || [];
    routesObject[path.dirname(filePath)].push(...routes);
}

function processDirectory(dirPath: string) {
    if (dirPath.includes("node_modules")) {
        return;
    }

    fs.readdirSync(dirPath).forEach((file) => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (path.extname(fullPath) === ".ts" && fs.existsSync(path.join(path.dirname(fullPath), "tsconfig.json"))) {
            processFile(fullPath);
        }
    });
}


processDirectory(".");
console.log(routesObject);
