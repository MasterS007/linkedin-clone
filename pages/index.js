/* eslint-disable react-hooks/exhaustive-deps */
import { AnimatePresence } from "framer-motion";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { modalState, modalTypeState } from "../atoms/modalAtom";
import Feed from "../components/Feed";
import HeaderDashboard from "../components/HeaderDashboard";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import { connectToDb } from "../util/mongodb";

export default function Home({ posts, articles }) {
  console.log(articles);
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);

  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/home");
    },
  });

  console.log("status", status);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (status === "authenticated") {
  //     setLoading(false);
  //   }
  // }, []);

  return (
    // loading ?
    //   <div>
    //     <h1>jsnajfnjsanfj</h1>
    //   </div>
    // ) : (
    <div className="bg-[#F3F2EF] dark:bg-black dark:text-white h-screen overflow-y-scroll md:space-y-6">
      <Head>
        <title>feed | LinkiedIn</title>
        <meta name="locale" content="en_US" />
        <link
          rel="icon"
          href="https://static.licdn.com/scds/common/u/images/logos/favicons/v1/favicon.ico"
        />
      </Head>
      <HeaderDashboard />
      <main className="flex justify-center gap-x-5 px-4 sm:px-12">
        <div className="flex flex-col md:flex-row gap-5">
          {/* sidebar */}
          <Sidebar />

          {/* feed */}
          <Feed posts={posts} />
        </div>
        {/* widget */}

        <Widgets articles={articles} />
        {/* Modal */}
        <AnimatePresence>
          {modalOpen && (
            <Modal handleClose={() => setModalOpen(false)} type={modalType} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  //if the user is authenticated
  const session = await getSession(context);
  //console.log("session", session);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/home",
      },
    };
  }

  // Get Post SSR
  const { db } = await connectToDb();
  const posts = await db
    .collection("posts")
    .find()
    .sort({ timestamp: -1 })
    .toArray();

  //Google News API
  const results = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`
  ).then((res) => res.json());

  return {
    props: {
      session,
      articles: results.articles,
      posts: posts.map((post) => ({
        _id: post._id.toString(),
        input: post.input,
        photoUrl: post.photoUrl,
        username: post.username,
        email: post.email,
        userImg: post.userImg,
        createdAt: post.createdAt,
      })),
    },
  };
}
