

function Turn(props) {
    return (
        <div>
            <p>{props.turn === "humanTurn" ? "Your turn!" : "My turn!"}</p>
        </div>
    )
}

export default Turn;