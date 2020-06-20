const initialData = {
  items: {
    "item-1": { id: "item-1", content: "Take out the garbage" },
    "item-2": { id: "item-2", content: "Watch my favorite show" },
    "item-3": { id: "item-3", content: "Change my phone" },
    "item-4": { id: "item-4", content: "Coook dinner" },
    "item-5": { id: "item-5", content: "Research stocks!" },
    "item-6": { id: "item-6", content: "Watch DND videos" }
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To do",
      itemIds: ["item-1", "item-2", "item-3", "item-4"]
    },
    "column-2": {
      id: "column-2",
      title: "In progress",
      itemIds: ["item-5"]
    },
    "column-3": {
      id: "column-3",
      title: "Done",
      itemIds: ["item-6"]
    }
  },
  rows: {
    
  },
  // Facilitate reordering of columns
  columnOrder: ["column-1", "column-2", "column-3"],
  // Facilitate reordering of rows
  rowOrder: ["row-1", "row-2"]
};

export default initialData;
