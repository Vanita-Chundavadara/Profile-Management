import notFoundImage from '../../assets/images/not_found-404_image.png';
const NotFound = () => {
    const notFoundTitle = 'Sorry, this page is not available';
    return (
        <>
            <div className="page-container error-found">
                <img
                    src={notFoundImage}
                    alt=""
                    className="img-setting"
                />
                <h1 className="title text-color">{notFoundTitle}</h1>
            </div>
        </>
    );
};

export default NotFound;
