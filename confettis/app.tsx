/// <reference lib="dom" />
/** @jsxImportSource https://esm.sh/react@18.2.0 */
import { type MouseEvent } from "https://esm.sh/react@18.2.0"
import confetti from "https://esm.sh/canvas-confetti@1.6.0"

const App = () => {
    function onMouseMove(e: MouseEvent) {
        confetti({
            particleCount: 5,
            origin: {
                x: e.pageX / globalThis.innerWidth,
                y: (e.pageY + 20) / globalThis.innerHeight,
            }
        })
    }

    return (
        <div onMouseMove={onMouseMove}>
            <h1>Hello World ! ⚛️</h1>
            <p>Building user interfaces.</p>
        </div>
    )
}

export default App
