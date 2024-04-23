export const loadSensitiveVariables = (variable: string) => {
    // if variable start with " or ' then remove it
    if (variable.startsWith('"')) {
        variable = variable.split('"').join('');
    }
    return variable;
};