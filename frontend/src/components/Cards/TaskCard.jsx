import moment from "moment";
import React from "react";
import { LuPaperclip } from "react-icons/lu";
import AvatarGroup from "../layout/AvatarGroup";
import Progress from "../Progress";

const TaskCard = ({
  title,
  description,
  status,
  priority,
  duedate,
  progress,
  createdAt,
  assignedTo,
  attachmentCount,
  todoCheckList,
  completedTodoCount,
  onClick,
}) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-600 bg-cyan-50 border border-cyan-200";
      case "Completed":
        return "text-green-600 bg-green-50 border border-green-200";
      default:
        return "text-violet-600 bg-violet-50 border border-violet-200";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "text-emerald-600 bg-emerald-50 border border-emerald-200";
      case "Medium":
        return "text-amber-600 bg-amber-50 border border-amber-200";
      default:
        return "text-rose-600 bg-rose-50 border border-rose-200";
    }
  };

  return (
    <div
      className="bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200 cursor-pointer"
      onClick={onClick}
    >
      {/* Status + Priority */}
      <div className="flex items-end gap-3 px-4">
        <div
          className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded mt-1`}
        >
          {status}
        </div>
        <div
          className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded mt-1`}
        >
          {priority} priority
        </div>
      </div>

      {/* Title + Description + Progress */}
      <div
        className={`px-4 border-l-[3px] ${
          status === "In Progress"
            ? "border-cyan-500"
            : status === "Completed"
            ? "border-green-500"
            : "border-violet-500"
        }`}
      >
        <p className="text-sm font-medium text-gray-800 mt-4 line-clamp-2">
          {title}
        </p>
        <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-[18px]">
          {description}
        </p>

        <p className="text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]">
          Task Done:{" "}
          <span className="font-semibold text-gray-700">
            {completedTodoCount}/{todoCheckList?.length || 0} tasks
          </span>
        </p>
        <Progress progress={progress} status={status} />
      </div>

      {/* Dates + Assigned + Attachments */}
      <div className="px-4">
        <div className="flex items-center justify-between my-1">
          <div>
            <label className="text-xs text-gray-500">Start Date</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(createdAt).format("MMM DD, YYYY")}
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-500">Due Date</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(duedate).format("MMM DD, YYYY")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 ">
          <AvatarGroup avatars={assignedTo || {}} />

          {attachmentCount > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg">
              <LuPaperclip className="text-blue-700" />{" "}
              <span className="text-xs text-gray-900">{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
