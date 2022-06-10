import { defineComponent } from 'vue';
import { useUserStore } from '../store/user'

export default defineComponent({
  name: 'App',
  setup() {
  const userStore = useUserStore()
    return () => (
      <>
        <h1>Home</h1>
        <h1>{userStore.name}</h1>
      </>
    );
  }
});