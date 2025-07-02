import { Input, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export const rezultatKolone = [
  {
    title: "Lab. test broj",
    dataIndex: "lab_tests_results_id",
    width: 150,
    ellipsis: true,
  },
  {
    title: "Naziv pretrage",
    dataIndex: "laboratory_tests_name",
    ellipsis: true,
  },
  {
    title: "Kod",
    dataIndex: "laboratory_tests_code",
    width: 250,
    ellipsis: true,
  },
  {
    title: "Jedinica mjere",
    dataIndex: "unit_of_measurement",
    width: 150,
    ellipsis: true,
  },
  {
    title: "Kritična vrijednost",
    width: 150,
    ellipsis: true,
    // dataIndex: 'critical_value',
    render: (record) =>
      record ? (
        record?.critical_value === "N" ? (
          <Tag color={"green"}>Ne</Tag>
        ) : (
          <Tag color={"red"}>Da</Tag>
        )
      ) : null,
  },
];

export const izisSifarnikKolone = [
  {
    title: "IZIS ID",
    dataIndex: "lab_tests_results_id",
    width: 30,
    sorter: (a, b) => a.lab_tests_results_id - b.lab_tests_results_id, // Sorting function
    defaultSortOrder: "ascend", // Default sort order
  },
  {
    title: "Šifra pretrage",
    dataIndex: "laboratory_tests_code",
    width: 120,
    ellipsis: true,
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => {
      return (
        <Input
          autoFocus={true}
          placeholder={"Pretraga..."}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            confirm({ closeDropdown: false });
          }}
          onPressEnter={() => confirm()}
          onBlur={() => confirm()}
        />
      );
    },
    filterIcon: <SearchOutlined />,
    onFilter: (value, record) =>
      (record?.laboratory_tests_code || "")
        .toLowerCase()
        .includes(value.toLowerCase()),
  },
  {
    title: "Naziv pretrage",
    dataIndex: "laboratory_tests_name",
    width: 150,
    ellipsis: true,
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => {
      return (
        <Input
          autoFocus={true}
          placeholder={"Pretraga..."}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            confirm({ closeDropdown: false });
          }}
          onPressEnter={() => confirm()}
          onBlur={() => confirm()}
        />
      );
    },
    filterIcon: <SearchOutlined />,
    onFilter: (value, record) =>
      record.laboratory_tests_name.toLowerCase().includes(value.toLowerCase()),
  },
];

export const kisSifarnikKolone = [
  {
    title: "KIS ID",
    dataIndex: "pretraga_sif",
    width: 50,
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => {
      return (
        <Input
          autoFocus={true}
          placeholder={"Pretraga..."}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            confirm({ closeDropdown: false });
          }}
          onPressEnter={() => confirm()}
          onBlur={() => confirm()}
        />
      );
    },
    filterIcon: <SearchOutlined />,
    onFilter: (value, record) =>
      record.pretraga_sif.toLowerCase().includes(value.toLowerCase()),
  },
  {
    title: "Šifra pretrage",
    dataIndex: "pretraga_code",
    width: 120,
    ellipsis: true,
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => {
      return (
        <Input
          autoFocus={true}
          placeholder={"Pretraga..."}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            confirm({ closeDropdown: false });
          }}
          onPressEnter={() => confirm()}
          onBlur={() => confirm()}
        />
      );
    },
    filterIcon: <SearchOutlined />,
    onFilter: (value, record) =>
      record.pretraga_code.toLowerCase().includes(value.toLowerCase()),
  },
  {
    title: "Naziv pretrage",
    dataIndex: "pretraga_naz",
    width: 150,
    ellipsis: true,
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => {
      return (
        <Input
          autoFocus={true}
          placeholder={"Pretraga..."}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            confirm({ closeDropdown: false });
          }}
          onPressEnter={() => confirm()}
          onBlur={() => confirm()}
        />
      );
    },
    filterIcon: <SearchOutlined />,
    onFilter: (value, record) =>
      record.pretraga_naz.toLowerCase().includes(value.toLowerCase()),
  },
  {
    title: "Naziv graf",
    dataIndex: "pretraga_naz_graf",
    width: 180,
    ellipsis: true,
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => {
      return (
        <Input
          autoFocus={true}
          placeholder={"Pretraga..."}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            confirm({ closeDropdown: false });
          }}
          onPressEnter={() => confirm()}
          onBlur={() => confirm()}
        />
      );
    },
    filterIcon: <SearchOutlined />,
    onFilter: (value, record) =>
      record.pretraga_naz_graf.toLowerCase().includes(value.toLowerCase()),
  },
];
