const Palette = (props) => {
  const handleClickRadio = (ev) => {
    
    props.handleInput(ev.currentTarget.name, ev.currentTarget.value);
  };

  return (
    <li className={`list__palette ${props.className}`}>
      <input
        type="radio"
        id="palette"
        className="list__radio js-input"
        name="palette"
        data-id={props.number}
        value={props.number}
        onClick={handleClickRadio}
        /* checked={`${props.data.palette} === ${props.number}`} */
      />
      <div className="colorOne"></div>
      <div className="colorTwo"></div>
      <div className="colorThree"></div>
    </li>
  );
};

export default Palette;