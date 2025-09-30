const SideBar = () => {
    return(
        <>
            <input type="checkbox" id="check" />
            <label htmlFor="check">
                <i className="fa-solid fa-bars" id="btn"></i>
                <i className="fa-solid fa-times" id="cancel"></i>
            </label>
            <div className="sidebar">
                <header>Aidea</header>
                <ul>
                    <li>
                        <a href="#"><i className="fa-solid fa-message"></i><span>Create new chat</span></a>
                    </li>
                    <li>
                        <a href="#"><i className="fa-solid fa-book"></i><span>Chat history</span></a>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default SideBar