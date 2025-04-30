'use client'

import { getTableLink } from "@/lib/utils"
import QRCode from "qrcode"
import { useEffect, useRef } from "react"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function QRCodeTable({ token, tableNumber, width }: {
    token: string
    tableNumber: number
    width?: number
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        const canvasElement = canvasRef.current
        QRCode.toCanvas(canvasElement, getTableLink({
            token,
            tableNumber
        }), (error) => {
            if (error) console.error(error)
            console.log('success!')
        })
    }, [])
    return (
        <canvas ref={canvasRef}></canvas>
    )
}