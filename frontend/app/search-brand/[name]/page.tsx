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

export default function SearchBrand({ params }: { params: { name: string } }) {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const fetchPosts = () => {
    axios.get<UserPost[]>(`http://localhost:8000/api/posts/containing-item-brand/${params.name}/`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  };
  const fetchItems = () => {
    axios.get<Item[]>(`http://localhost:8000/api/items/by-brand/${params.name}/`)
      .then((res) => setItems(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchItems()
    fetchPosts();
  }, []);

  const renderPosts = () => {
    return posts.map((post) => (
      <div key={`post-${post.id}`} className={styles.post}>
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

  const renderItems = () => {
    return items.map((item) =>
      <div key={`item-${item.id}`}>
        <div className={`card ${styles.card}`}>
          <div className={`card-body ${styles.cardBody}`}>
            <div className='m-2'>
              <Link href={`/search-item/${item.id}`}>
                <i className="bi bi-search me-2"></i>
              </Link>
              {item.title} from 
              <Link href={`/search-brand/${item.brand}`} className=' ms-2 me-1'>
                {item.brand}
              </Link> ({item.item_type}) 
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <main className="container">
        <div className={globalStyles.text1}>
          <h1 className="m-4">{params.name} items:</h1>
          {renderItems()}
          <h1 className="m-4">Posts featuring {params.name}:</h1>
          {renderPosts()}
        </div>
      </main>
    </div>
  );
};