const navTo = (url: string) => `window.location.href = '${url}';`;
// not available in node. Added as string to HTML template
export default navTo;
