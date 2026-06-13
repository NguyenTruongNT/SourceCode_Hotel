"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type User = {
    id: string
    name: string
    email: string
    phone: string
    address?: string
    isLoggedIn: boolean
}

// Danh sách tài khoản khách hàng thật
const CUSTOMER_ACCOUNTS = [
    {
        id: "KH001",
        name: "Nguyễn Văn An",
        email: "nguyenvana@example.com",
        phone: "0901234567",
        address: "12 đường Lê Lợi, Quận 1, TP.HCM",
        password: "123456"
    },
    {
        id: "KH002",
        name: "Trần Thị Bình",
        email: "tranthibinh@example.com",
        phone: "0912345678",
        address: "45 đường Nguyễn Huệ, Quận 2, TP.HCM",
        password: "123456"
    },
    {
        id: "KH003",
        name: "Lê Văn Cường",
        email: "levancuong@example.com",
        phone: "0923456789",
        address: "78 đường Võ Văn Tần, Quận 3, TP.HCM",
        password: "123456"
    },
    {
        id: "KH004",
        name: "Phạm Thị Dung",
        email: "phamthidung@example.com",
        phone: "0934567890",
        address: "23 đường Nguyễn Đình Chiểu, Quận 4, TP.HCM",
        password: "123456"
    }
]

type AuthContextType = {
    user: User
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
    isLoggedIn: boolean
    isLoading: boolean
}

const defaultUser: User = {
    id: "",
    name: "",
    email: "",
    phone: "",
    isLoggedIn: false
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(defaultUser)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const savedUser = localStorage.getItem("thad_customer_user")
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser)
                setUser({ ...parsedUser, isLoggedIn: true })
            } catch (e) {
                console.error("Failed to parse user", e)
            }
        }
        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Tìm tài khoản trong danh sách khách hàng thật
                const foundCustomer = CUSTOMER_ACCOUNTS.find(
                    (acc) => acc.email === email && acc.password === password
                )

                if (foundCustomer) {
                    const newUser = {
                        id: foundCustomer.id,
                        name: foundCustomer.name,
                        email: foundCustomer.email,
                        phone: foundCustomer.phone,
                        address: foundCustomer.address,
                        isLoggedIn: true
                    }
                    setUser(newUser)
                    localStorage.setItem("thad_customer_user", JSON.stringify(newUser))
                    resolve(true)
                } else {
                    resolve(false)
                }
            }, 500)
        })
    }

    const logout = () => {
        setUser(defaultUser)
        localStorage.removeItem("thad_customer_user")
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoggedIn: user.isLoggedIn, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}