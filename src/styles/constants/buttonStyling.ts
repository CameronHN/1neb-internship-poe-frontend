export const deleteButtonStyle = (hasSelectedItems: boolean) => ({
    color: hasSelectedItems ? "#fff" : "#d13438",
    borderColor: "#d13438",
    backgroundColor: hasSelectedItems ? "#d13438" : "transparent",
});