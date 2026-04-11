import type { UserRow } from "./columns";

export async function load() {
 const users: UserRow[] = [
  {
     id: "usr_001",
     name: "Dr. Tesfaye Wolde",
     email: "tesfaye.w@ethio-uni.edu",
     tier: "library",
     status: "active",
  },
  {
     id: "usr_002",
     name: "Hana Melaku",
     email: "hana.melaku@api.io",
     tier: "scholar",
     status: "active",
  },
  {
     id: "usr_003",
     name: "Abiel Kebede",
     email: "kebede.a@outreach.com",
     tier: "free",
     status: "suspended",
  },
  {
     id: "usr_004",
     name: "Prof. Elias Bekele",
     email: "bekele.e@heritage.gov",
     tier: "library",
     status: "active",
  },
  {
     id: "usr_005",
     name: "Meron Tadesse",
     email: "meron.tadesse@collab.org",
     tier: "scholar",
     status: "active",
  },
 ];

 return {
    users,
 };
}