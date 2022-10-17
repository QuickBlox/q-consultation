import SectionList from '../../components/SectionList'
import ChatMessage from './ChatMessage'
import useComponent, { ChatMessagesProps } from './useComponent'
import './styles.css'

export default function ChatMessages(props: ChatMessagesProps) {
  const {
    data: { sections, resetScroll },
    store: { myAccountId, loading, users },
    actions: { markMessageRead },
    handlers: { loadMoreMessages },
  } = useComponent(props)

  return (
    <SectionList
      resetScroll={resetScroll}
      className="messages-container"
      onEndReached={loadMoreMessages}
      onEndReachedThreshold={0.95}
      refreshing={loading}
      renderSectionHeader={(section) => (
        <div className="date">{section.title}</div>
      )}
      renderItem={(item) => (
        <ChatMessage
          key={item._id}
          users={users}
          message={item}
          myAccountId={myAccountId}
          markMessageRead={markMessageRead}
          chatOpen={props.chatOpen}
        />
      )}
      sections={sections}
    />
  )
}
