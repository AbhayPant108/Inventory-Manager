import { cn } from "@/utils/cn";
import type { ClassValue } from "clsx";
import type { ReactElement } from "react";
import {motion} from 'motion/react'

interface IconProps {
    children:ReactElement,
    className?:ClassValue
}
export function Icon({children,className}:IconProps){

    return <motion.span 
    whileHover={{
        scale:1.2,
        y:-10
    }}
    className={
        cn('inline-flex hover:cursor-pointer items-center justify-center border  w-10 h-10 rounded-full', 
      className)}>
        {children}
    </motion.span>
}