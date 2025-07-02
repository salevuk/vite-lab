import {Button, Result} from "antd";

const AntResult = ({title, btnTitle, onClick, btnLoading}) => {
    return (
        <Result
            title={title}
            extra={
                <Button type="primary" onClick={onClick} loading={btnLoading}>{btnTitle}</Button>
            }
        />
    );
};

export default AntResult;