import classes from './LoadingSpinner.module.scss';
import {Space, Spin} from "antd";

const LoadingSpinner = () => {
    return (
        <div className={`${classes.spin_container}`}>
            <Space size={'large'} className={'loader'}>
                <Spin size="large"/>
            </Space>
        </div>
    );
};

export default LoadingSpinner;