

function Player(props) {
    return (
        <div className={props.className}>
            <h1>{props.name}</h1>
            <p>total: {props.coins.pennies + props.coins.nickels * 5 + props.coins.dimes * 10 + props.coins.quarters * 25}¢</p>
            <p>pennies: {props.coins.pennies}</p>
            <p>nickels: {props.coins.nickels}</p>
            <p>dimes: {props.coins.dimes}</p>
            <p>quarters: {props.coins.quarters}</p>
        </div>
    )
}

export default Player;