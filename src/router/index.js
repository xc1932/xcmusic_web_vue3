import { createRouter, createWebHashHistory } from 'vue-router'
import { isLoggedIn } from '@/utils/cookie'
import { messagebox } from '@/utils/customComponent'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/explore',
    name: 'explore',
    component: () => import('@/views/ExploreView.vue'),
    props: true
  },
  {
    path: '/mymusic',
    name: 'mymusic',
    component: () => import('@/views/MyMusicView.vue'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/playlist/:id',
    name: 'playlist',
    components: {
      noCache: () => import('@/views/PlaylistView.vue')
    },
    props: true
  },
  {
    path: '/album/:id',
    name: 'album',
    components: {
      noCache: () => import('@/views/AlbumView.vue')
    },
    props: true
  },
  {
    path: '/artist/:id',
    name: 'artist',
    components: {
      noCache: () => import('@/views/ArtistView.vue')
    },
    props: true
  },
  {
    path: '/mv/:id',
    name: 'mv',
    components: {
      noCache: () => import('@/views/MVView.vue')
    },
    props: true
  },
  {
    path: '/song/:id',
    name: 'song',
    components: {
      noCache: () => import('@/views/SongDetailView.vue')
    },
    props: true
  },
  {
    path: '/search/:keywords',
    name: 'search',
    components: {
      noCache: () => import('@/views/SearchView.vue')
    },
    props: true,
    children: [
      {
        path: ':type',
        name: 'searchDetail',
        component: () => import('@/views/SearchDetailView.vue'),
        props: true,
      }
    ]
  },
  {
    path: '/daily',
    name: 'daily',
    components: {
      noCache: () => import('@/views/DailyRecommendView.vue')
    },
  },
  {
    path: '/newalbum',
    name: 'newalbum',
    components: {
      noCache: () => import('@/views/NewAlbumView.vue')
    },
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/TestView.vue')
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requireLogin) {
    if (isLoggedIn()) {
      next()
    } else {
      messagebox.warn('请先登录')
    }
  } else {
    next()
  }
})

export default router
