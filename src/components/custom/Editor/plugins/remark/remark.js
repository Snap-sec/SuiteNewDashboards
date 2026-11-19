import { $remark } from "@milkdown/kit/utils";
import { visit } from 'unist-util-visit';

const remarkMarkColor = () => {
  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      const match = node.value.match(/==(?:{#([^}]+)})?([^=]+)==/);
      if (match) {
        const [_, color, text] = match;
        const markNode = { // Renamed 'mark' to 'markNode' for clarity
          type: "mark",
          data: { color: color || null }, // Ensure color is null if undefined
          children: [{ type: "text", value: text }],
          position: node.position // Preserve position data for better debugging
        };

        // 🐛 FIX: Replace the original text node with the new markNode
        // splice(index, 1, newNode) removes 1 element at 'index' and inserts 'newNode'
        parent.children.splice(index, 1, markNode);

        // ⚠️ IMPORTANT: Tell unist-util-visit to skip the next iteration
        // because we've modified the array in place. [visit.SKIP, index]
        // re-evaluates the current index, which now holds the new markNode.
        return [visit.SKIP, index];
      }
    });
  };
};

const milkdownMarkColorPlugin = $remark("markColor", () => remarkMarkColor);

export default milkdownMarkColorPlugin;