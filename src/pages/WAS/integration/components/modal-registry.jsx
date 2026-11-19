import PostmanModal from "./integration-modals/postman-modal";
import SwaggerModal from "./integration-modals/swagger-modal";

function ModalRegistry() {
    return (
        <div>
            <PostmanModal />
            <SwaggerModal />
        </div>
    )
}

export default ModalRegistry
