import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosinstance'
import { API_URLS } from '../../utils/apipaths'
import { LuUser } from 'react-icons/lu'
import Model from '../Model'
import AvatarGroup from '../layout/AvatarGroup'

const SelectUser = ({ selectedusers, setselectedusers }) => {
  const [ALLUsers, setAllUsers] = useState([])
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [tempSelectedUsers, setTempSelectedUsers] = useState([])

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_URLS.USERS.GET_ALL_USERS)
      if (response.data?.length > 0) {
        setAllUsers(response.data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const handleAssign = () => {
    setselectedusers(tempSelectedUsers)
    setIsModelOpen(false)
  }

  const selectedUserAvatars = ALLUsers.filter((user) =>
    selectedusers.includes(user._id)).map((user) => user.profileImageUrl)
  

  useEffect(() => {
    getAllUsers()
  }, [])

  useEffect(() => {
    if (selectedusers.length === 0) {
      setTempSelectedUsers([])
    }
  }, [selectedusers])

  return (
    <div className="space-y-4 mt-2">
      {selectedUserAvatars.length === 0 && (
        <button className="card-btn" onClick={() => {
          setTempSelectedUsers(selectedusers) // sync current selection
          setIsModelOpen(true)
        }}>
          <LuUser className="text-sm" /> Add Member
        </button>
      )}

      {selectedUserAvatars.length > 0 && (
        <div
          className="cursor-pointer"
          onClick={() => {
            setTempSelectedUsers(selectedusers) // sync before opening
            setIsModelOpen(true)
          }}
        >
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
        </div>
      )}

      <Model
        isOpen={isModelOpen}
        onClose={() => setIsModelOpen(false)}
        title="Select Users"
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {ALLUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 border-b border-gray-200"
            >
              <img
                src={user.profileImageUrl || '/default-avatar.png'}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">
                  {user.name}
                </p>
                <p className="text-[13px] text-gray-500">{user.email}</p>
              </div>
              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded-sm outline-none"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button className="card-btn" onClick={() => setIsModelOpen(false)}>
            CANCEL
          </button>
          <button className="card-btn-fill" onClick={handleAssign}>
            DONE
          </button>
        </div>
      </Model>
    </div>
  )
}

export default SelectUser
