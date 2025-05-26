import React, {useState, useEffect, useRef, useCallback} from 'react';

function fetchData(page, pageSize=20){
    return new Promise((resolve) =>{
        setTimeout(()=> {
            const posts = Array.from({length: pageSize}).map((_, i) => ({
                id: (page-1) * pageSize+i+1,
                title: `Post #${(page - 1) * pageSize + i + 1}`,
                content: `Infinite Scroll content ${(page - 1) * pageSize + i + 1}`
            }))
            resolve({ posts, totalPages: 50 });
        }, 1000)
    })
}


const VirtualizedFeed = () => {

    const CONTAINER_HEIGHT = window.innerHeight
    const ITEM_HEIGHT = 100
    const PAGE_SIZE = 20;
    const BUFFER = 5 // for extra items above/below viewport
    const THRESHOLD = 300
    // now declaring states
    const [items, setItems] = useState([])
    const [page, setPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const containerRef = useRef()

    // on initial load it will trigger data fetching
    useEffect(() => {
        loadMore()
    }, []) 

    // this will be triggerd everytime either page, hasMore or loading state changes
    const loadMore = useCallback( async () => {
        if(loading || !hasMore) return 
        setLoading(true)
        const {posts, totalPages} = await fetchData(page, PAGE_SIZE)
        console.log('posts', posts)
        setItems((prevItem) => [...prevItem, ...posts])
        setPages(p => p+1)
        if(page >= totalPages) setHasMore(false) //means reached end
        setLoading(false)
    }, [page, hasMore, loading])

    // now we will write scroll feature to loadMore data or not

    const [range, setRange] = useState({start: 0, end: 0})
    const onScroll =() => {
        const containerTop = containerRef.current.scrollTop;
        const totalItems = items.length;
        const totalItemHeight = totalItems * ITEM_HEIGHT
        if(containerTop + CONTAINER_HEIGHT >= totalItemHeight - THRESHOLD){
            loadMore()
        }
        // now computing visible window
        let startIndex = Math.max(0, Math.floor(containerTop/ITEM_HEIGHT) - BUFFER)
        let endIndex = Math.min(totalItems, Math.ceil((containerTop + CONTAINER_HEIGHT) / ITEM_HEIGHT) + BUFFER)
        setRange({start: startIndex, end: endIndex})
    }

    // now attaching eventListener
    useEffect(() => {
        const node = containerRef.current;
        node.addEventListener('scroll', onScroll)
        return () => node.removeEventListener('scroll', onScroll)
    }, [items, loading, hasMore])

    const topHeight = range.start * ITEM_HEIGHT;
    const bottomHeight = (items.length - range.end) * ITEM_HEIGHT;
    console.log('data->>', items)
    return (
        <div
            className='container'
            ref={containerRef}
            style={{
                height: CONTAINER_HEIGHT,
                overflowY: "auto",
                border: "3px solid red",
            }}
        >
      <div style={{ height: items.length * ITEM_HEIGHT, position: "relative" }}>
        <div style={{ height: topHeight }} />
        {items.slice(range.start, range.end).map((post) => (
          <div
            id={post.id}
            key={post.id}
            style={{
              height: ITEM_HEIGHT - 1, 
              boxSizing: "border-box",
              borderBottom: "2px solid cyan",
              padding: "8px",
              position: "relative",
            }}
          >
            <h4 style={{ margin: 0 }}>{post.title}</h4>
            <p style={{ margin: "4px 0 0" }}>{post.content}</p>
          </div>
        ))}

        <div style={{ height: bottomHeight }} />

        {loading && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              textAlign: "center",
              padding: "16px",
              background: "rgba(255,255,255,0.8)",
            }}
          >
            Loading…
          </div>
        )}
      </div>
    </div>
    )
}

export default VirtualizedFeed;