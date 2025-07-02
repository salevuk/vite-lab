import { Tabs } from "antd";
import PropTypes from "prop-types";

const AntTab = (props) => {
  const items = props.tabsData
    ? props.tabsData.map((tab) => ({
        label: tab.label,
        key: tab.key,
        children: tab.children,
      }))
    : [];
  return (
    <Tabs
      tabPosition={"top"}
      type={"card"}
      onChange={props.onChange}
      items={items}
      activeKey={props.activeTabKey}
      tabBarStyle={{ fontFamily: "Inter, sans-serif" }} // nije još treba
    />
  );
};

export default AntTab;

AntTab.propTypes = {
  activeTabKey: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  tabsData: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      children: PropTypes.node.isRequired,
    })
  ).isRequired,
};
