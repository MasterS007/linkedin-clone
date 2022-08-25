import {
  ArticleOutlined,
  EventSharp,
  PhotoSizeSelectActual,
  VideoCameraBack,
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { modalState, modalTypeState } from "../atoms/modalAtom";

function Input() {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);

  //console.log(session);
  return (
    <div className="bg-white dark:bg-[#1D2226] rounded-lg p-3 space-y-3 border border-x-gray-300 dark:border-none ">
      <div className="flex items-center space-x-2">
        <Avatar
          src={session?.user?.image}
          className="!h-10 !w-10 !cursor-pointer"
        />
        {/* modal */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="rounded-full border border-gray-400 py-2.5 px-3 opacity-80 hover:opacity-100 font-medium  w-full text-left"
          onClick={() => {
            setModalOpen(true);
            setModalType("dropIn");
          }}
        >
          Start a post
        </motion.button>
      </div>

      {/* icons */}

      <div className="flex items-center flex-wrap gap-4 justify-center md:gap-10">
        <button className="inputButton group">
          <PhotoSizeSelectActual className="text-blue-400" />
          <h4 className="opacity-80 group-hover:opacity-100">Photo</h4>
        </button>
        <button className="inputButton group">
          <VideoCameraBack className="text-green-400" />
          <h4 className="opacity-80 group-hover:opacity-100">Video</h4>
        </button>
        <button className="inputButton group">
          <EventSharp className="text-orange-400" />
          <h4 className="opacity-80 group-hover:opacity-100">Event</h4>
        </button>
        <button className="inputButton group">
          <ArticleOutlined className="text-red-400" />
          <h4 className="opacity-80 group-hover:opacity-100">Write Article</h4>
        </button>
      </div>
    </div>
  );
}

export default Input;
