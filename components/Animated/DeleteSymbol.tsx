export default function DeleteSymbol({ classes, onClickEvent}) {

    return (
        <div className={classes} onClick={onClickEvent}>
            <svg className="hover:fill-white transition-colors" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32">
                <title>cancel-circle</title>
                <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
                <path d="M21 8l-5 5-5-5-3 3 5 5-5 5 3 3 5-5 5 5 3-3-5-5 5-5z"></path>
            </svg>
        </div>
    )
}