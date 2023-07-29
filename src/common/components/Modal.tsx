import { Modal } from 'antd';
import React, { ReactNode } from 'react';

interface CommonModalProps {
  isOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  title: string;
  children: ReactNode;
}

const CommonModal: React.FC<CommonModalProps> = ({
  isOpen,
  handleOk,
  handleCancel,
  title,
  children,
}) => {
  return (
    <Modal
      title={title}
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {children}
    </Modal>
  );
};

export default CommonModal;