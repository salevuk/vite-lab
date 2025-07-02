import React from 'react';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';

export const getCustomButtons = ({selektovanaUputnicaId, isLoading, jmbg, form, setTriggerFetch, handleFormSubmit,
                                     setSelektovanaUputnica, setSelektovanaUputnicaId, setJmbg, setKisModuli, id, setId
                                 }) => [
    {
        text: 'Traži',
        icon: <SearchOutlined />,
        loading: isLoading,
        type: 'primary',
        onClick: () => {
            if (jmbg){
                if (selektovanaUputnicaId) {
                    setTriggerFetch(true);
                } else {
                    form.validateFields()
                        .then((values) => {
                            handleFormSubmit(values);
                        })
                        .catch((errorInfo) => {
                            console.error("Validation Failed:", errorInfo);
                        });
                }
            } else {
                form.validateFields()
                    .then((values) => {
                        handleFormSubmit(values);
                    })
                    .catch((errorInfo) => {
                        console.error("Validation Failed:", errorInfo);
                    });
            }
        }
    },
    {
        text: 'Poništi',
        danger: true,
        disabled: (!id && !jmbg) || isLoading,
        icon: <CloseOutlined />,
        onClick: () => {
            form.resetFields();
            if (jmbg){
                setSelektovanaUputnica([]);
                setSelektovanaUputnicaId(null);
                setJmbg(null);
            } else {
                setId(null);
            }
            setKisModuli([]);
        }
    },
];