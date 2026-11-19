import { InputRule } from "@milkdown/kit/prose/inputrules";
import { $inputRule } from "@milkdown/kit/utils";
import markSchema from './schema'; // Ensure markSchema is imported

export const markerInputRule = $inputRule(
    () => new InputRule(
        /==(?<text>[^=]+)==$/, // Matches ==text==
        (state, match, start, end) => {
            const text = match.groups?.text; // Use named capture group
            const { tr } = state;

            // Ensure text content was captured
            if (text) {
                // Apply the mark to the matched text
                const markType = state.schema.marks.mark; // Get your registered mark type
                if (markType) {
                    // Corrected line: Use 'end' directly, no '+1'
                    tr.replaceWith(start, end, state.schema.text(text)).addMark(start, start + text.length, markType.create());
                }
            }
            return tr;
        }
    )
);

// A more complex rule for color:
export const markerColorInputRule = $inputRule(
    () => new InputRule(
        /==\{#(?<color>[A-Fa-f0-9]{6})\}(?<text>[^=]+)==$/, // Matches =={#RRGGBB}text==
        (state, match, start, end) => {
            const color = match.groups?.color; // Use named capture groups
            const text = match.groups?.text;
            const { tr } = state;

            // Ensure color and text content were captured
            if (color && text) {
                const markType = state.schema.marks.mark; // Get your registered mark type
                if (markType) {
                    // This rule already correctly uses 'end' directly
                    tr.replaceWith(start, end, state.schema.text(text)).addMark(start, start + text.length, markType.create({ color: `#${color}` }));
                }
            }
            return tr;
        }
    )
);