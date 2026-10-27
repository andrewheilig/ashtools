

function Algorithms(props) {
    const label =
      props.algorithmId === "threshold"
        ? "Threshold"
        : props.algorithmId === "greedy"
          ? "Greedy"
          : "—";
    return (
        <div>
            <p>Current Algorithm: {label}<br/>
            <em>{props.description}</em></p>
        </div>
    )
}

export default Algorithms;
