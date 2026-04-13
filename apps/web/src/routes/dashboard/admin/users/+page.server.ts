import type { UserRow } from "./columns";

export async function load() {
 const users: UserRow[] = [
  {
     id: "usr_001",
     avatar: "https://i.pravatar.cc/150?img=1",
     name: "Tesfaye Wolde",
     email: "abc@cdef.com",
     status: "active",
  },
  {
     id: "usr_002",
     avatar: "https://i.pravatar.cc/150?img=2",
     name: "Hana Melaku",
     email: "abc@cdef.com",
     status: "active",
  },
  {
     id: "usr_003",
     avatar: "https://i.pravatar.cc/150?img=1",
     name: "Abiel Kebede",
     email: "abc@cdef.com",
     status: "suspended",
  },
  {
     id: "usr_004",
     avatar: "https://i.pravatar.cc/150?img=2",
     name: "Elias Bekele",
     email: "abc@cdef.com",
     status: "active",
  },
  {
     id: "usr_005",
     avatar: "https://i.pravatar.cc/150?img=1",
     name: "Meron Tadesse",
     email: "abc@cdef.com",
     status: "active",
  },
 ];

 return {
    users,
 };
}