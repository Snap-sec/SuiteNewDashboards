import { toAbsoluteUrl } from "../../lib/helpers";


function FileIcon({ type }) {
    return (
        <img
        src={toAbsoluteUrl(`/media/file-types/${type || "image"}.svg`)}
        />
    )
}


export default FileIcon;