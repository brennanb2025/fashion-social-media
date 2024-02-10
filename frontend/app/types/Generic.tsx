import { ReactNode } from 'react'

export type ModalProps =  {
    children: ReactNode;
    open: boolean;
    close: () => void;
    title: string;
}

export type SuccessResult =  {
    message: string
}