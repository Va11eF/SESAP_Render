import { useRouteError } from "react-router-dom"

export default function ErrorPage(){
    const error = useRouteError()
    return (
        <div id="error-message">
            <h1>404</h1>
            <p><i className="fa-solid fa-headphones fa-bounce"/> Page: {error.statusText || error.message}</p>
        </div>
    )
}