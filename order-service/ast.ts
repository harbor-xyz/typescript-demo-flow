import { Project, ts } from 'ts-morph'

const project = new Project(
    {
        tsConfigFilePath: './tsconfig.json',
    }
)

function removeQuotes(str: string): string {
    return str.replace(/^['"]|['"]$/g, '');
  }

  

function extractInfo() {
    const sourceFile = project.getSourceFileOrThrow("index.ts");
    const variableDeclarationsE = sourceFile.getVariableDeclarations();

    const expressInstance = variableDeclarationsE.find((variable) => {
      return variable.getText().includes("express");
    });

    if (!expressInstance) {
      throw new Error("Express instance not found");
    }

    const expressInstanceName = expressInstance.getName();
    console.log("Express instance stored in ", expressInstanceName);


    const imports = sourceFile.getImportDeclarations();
    const variableDeclarations = sourceFile.getVariableDeclarations();
    const callExpressions = sourceFile.getDescendantsOfKind(ts.SyntaxKind.CallExpression);
  
    console.log("Imports:");
    imports.forEach((imp) => {
      console.log(`- ${imp.getModuleSpecifierValue()}`);
    });
  
    console.log("\nVariables:");
    variableDeclarations.forEach((variable) => {
      console.log(`- ${variable.getName()}`);
    });
  
    console.log("\nMethods & Routes:");
    const routes: string[] = [];
    const httpMethods = ["get", "post", "put", "delete", "patch", "options", "head"];
    callExpressions.forEach((call) => {
      const expression = call.getExpression();
      if (expression.getText().includes(".")) {
        const routeMethod = expression.getText().split(".")[1];
        const routeArgs = call.getArguments();
        if (routeArgs.length > 0 && httpMethods.includes(routeMethod)) {
          routes.push(removeQuotes(routeArgs[0].getText()));
          console.log(`- ${expression.getText()} -> ${removeQuotes(routeArgs[0].getText())}`);
        }
      }
    });
  
    console.log("\nRoutes:");
    routes.forEach((route) => {
      console.log(`- ${route}`);
    });
  
    const routesObject: { method: string; path: string }[] = [];
    callExpressions.forEach((call) => {
      const expression = call.getExpression();
      if (expression.getText().includes(".")) {
        const routeMethod = expression.getText().split(".")[1];
        const routeArgs = call.getArguments();
        if (routeArgs.length > 0 && httpMethods.includes(routeMethod)) {
          routesObject.push({
            method: routeMethod,
            path: removeQuotes(routeArgs[0].getText()),
          });
        }
      }
    });
  
    console.log("\nRoutes Object:");
    console.log(routesObject);
  }
  
  
extractInfo()