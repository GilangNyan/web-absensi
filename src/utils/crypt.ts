import { type JwtPayload, jwtDecode } from "jwt-decode"

interface IJwtPayload extends JwtPayload {
  employees: any
  role: any
}

export const base64Encode = (data: any) => {
  const result = btoa(data)
  return result
}

export const base64Decode = (data: any) => {
  const result = atob(data)
  return result
}

export const decodeJwt = (data: any) => {
  const result = jwtDecode<IJwtPayload>(data)
  return result
}