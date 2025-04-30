'use client'

import { getTableLink } from "@/lib/utils"
import QRCode from "qrcode"
import { useEffect, useRef } from "react"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function QRCodeTable({ token, tableNumber, width = 250 }: {
    token: string
    tableNumber: number
    width?: number
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        const canvasElement = canvasRef.current!
        canvasElement.height = width + 70
        canvasElement.width = width
        const canvasContext = canvasElement.getContext('2d')!
        canvasContext.fillStyle = '#fff'
        canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)
        canvasContext.font = '20px Arial'
        canvasContext.textAlign = 'center'
        canvasContext.fillStyle = '#000'
        canvasContext.fillText(`Bàn số ${tableNumber}`,
            canvasElement.width / 2,
            canvasElement.width + 20
        )
        canvasContext.fillText(
            `Quét mã QR để gọi món`,
            canvasElement.width / 2,
            canvasElement.width + 50
        )
        const virtalCanvas = document.createElement('canvas')
        QRCode.toCanvas(
            virtalCanvas,
            getTableLink({
                tableNumber,
                token
            }),
            (error) => {
                if (error) console.error(error)
                canvasContext.drawImage(virtalCanvas, 0, 0, width, width)
            }
        )

    }, [tableNumber, token, width])
    return (
        <canvas ref={canvasRef}></canvas>
    )
}