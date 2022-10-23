
/**
 * Saves any kind of Array to the session storage
 * @param {Array} data 
 */
export const saveArrayToSession = (data: any[], name: string = 'storage'): void => window.sessionStorage.setItem(name, JSON.stringify(data));

/**
 * Get named array from session storage
 * @param {string} name Storage name
 * @returns []
 */
export const getStoredArrayFromSession = (name: string = 'storage'): [] => JSON.parse(sessionStorage.getItem(name));

/**
* Retruns current Year as String
*/
export const getCurrentYearAsString = (): string => {
    return JSON.stringify(new Date().getFullYear());
}

export const getCurrentMonthAsString = (): string => {
    return JSON.stringify(new Date().getMonth()+1);
}