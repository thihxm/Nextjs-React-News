import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.scss'

export function SignInButton() {
  const isUserLoggedIn = true

  return isUserLoggedIn ? (
    <button type="button" className={styles['signIn-button']}>
      <FaGithub color="#04d361" /> Thiago Medeiros{' '}
      <FiX color="#737380" className={styles['close-icon']} />
    </button>
  ) : (
    <button type="button" className={styles['signIn-button']}>
      <FaGithub color="#eba417" /> Sign in with Github
    </button>
  )
}
