import { $markSchema } from "@milkdown/kit/utils";

export const DEFAULT_COLOR = "#ffff00";

export const markSchema = $markSchema("mark", () => ({
  inclusive: false,
  code: false,
  attrs: {
    color: {
      default: null,
      // validate: "string",
    },
  },
  parseDOM: [
    {
      tag: "mark",
      getAttrs: (node) => ({
        color: node.style.backgroundColor,
      }),
    },
  ],
  toDOM: (mark) => ["mark", { style: `background-color: ${mark.attrs.color}` }],
  parseMarkdown: {
    match: (node) => node.type === "mark", // Make sure this matches your Remark plugin's output
    runner: (state, node, markType) => {
        // Verify node.data?.color is correctly being picked up if applicable
        state.openMark(markType, { color: node.data?.color });
        state.next(node.children); // Process the content inside the mark
        state.closeMark(markType);
    },
  },
  // parseMarkdown: {
  //   match: (node) => node.type === "mark",
  //   runner: (state, node, markType) => {
  //     const color = (node).data?.color;
  //     state.openMark(markType, { color });
  //     state.next(node.children);
  //     state.closeMark(markType);
  //   },
  // },
  toMarkdown: {
    match: (node) => node.type.name === "mark",
    runner: (state, mark) => {
      let color = mark.attrs.color;
      if (color?.toLowerCase() === DEFAULT_COLOR.toLowerCase()) {
        color = undefined;
      }
      state.withMark(mark, "mark", undefined, {
        data: { color },
      });
    },
  },
}));


export default markSchema;