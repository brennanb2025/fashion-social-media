"use client";
import React, { useState, useEffect } from 'react';
import globalStyles from '@/app/styles/myGlobals.module.css'
import axios from 'axios';
//import { SearchItemProps } from '@/app/types/Item';
import { Item, UserPost } from '@/app/types/UserPost';
import { Navbar } from '@/app/components/Navbar';
import PostImageCarousel from '@/app/components/PostImageCarousel';
import PostBar from '@/app/components/PostBar';
import styles from '@/app/styles/userPostGrid.module.css'
import Link from 'next/link';

export default function SearchItem({ params }: { params: { id: number } }) {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [item, setItem] = useState<Item>({} as Item);

  const fetchPosts = () => {
    axios.get<UserPost[]>(`http://localhost:8000/api/items/${params.id}/posts/`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  };
  const fetchItem = () => {
    axios.get<Item>(`http://localhost:8000/api/items/${params.id}/`)
      .then((res) => setItem(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchItem()
    fetchPosts();
  }, []);

  const renderPosts = () => {
    return posts.map((post) => (
      <div key={post.id} className={styles.post}>
        <div className={`card ${styles.card}`}>
          <div className={`card-body ${styles.cardBody}`}>
            <h5 className={`card-title ${styles.cardTitle}`}>{post.title}</h5>
            <PostImageCarousel userPost={post} />
            <h5 className={styles.cardCaption}>{post.caption}</h5>
            <h5 className={styles.cardTimestamp}>{post.timestamp}</h5>
            <PostBar post={post} userid={1} /> 
            {/* TODO: userid */}
          </div>
        </div>
      </div>
    ));
  };

  const renderItem = () => {
    return (
      <div>
        <h1 className='m-4'>Item: {item.title} from 
        <Link href={`/search-brand/${item.brand}`} className=' ms-3 me-2'>
          {item.brand}
        </Link> ({item.item_type}) </h1>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <main className="container">
        <div className={globalStyles.text1}>
          {renderItem()}
          {renderPosts()}
        </div>
      </main>
    </div>
  );
};