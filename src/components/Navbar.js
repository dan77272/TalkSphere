import styles from './navbar.module.scss'

export default function Navbar(){
    return (
        <div className={styles.navbar}>
            <div className={styles.left}>
                <p className={styles.chatmegle}>TalkSphere</p>
                <p className={styles.strangers}>Talk to Strangers!</p>
            </div>
            <div className={styles.right}>
                <p className={styles.online}>45,000+ online now</p>
            </div>
        </div>
    )
}