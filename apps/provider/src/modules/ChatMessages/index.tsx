import SectionList from '../../components/SectionList'
import MessageGroup from './MessageGroup'
import useComponent, { ChatMessagesProps } from './useComponent'
import './styles.css'
import MessageBody from './MessageBody'

export default function ChatMessages(props: ChatMessagesProps) {
  const { chatOpen, setInputValue } = props
  const {
    data: { sections, resetScroll },
    store: { myAccountId, loading, users, loadMessageId, translate },
    actions: {
      markMessageRead,
      getQuickAnswer,
      getQuickAnswerCancel,
      getTranslate,
      showNotification,
    },
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
      renderItem={([key, groupMessages], sectionListRef) => (
        <MessageGroup
          key={key}
          users={users}
          messages={groupMessages}
          myAccountId={myAccountId}
          chatOpen={chatOpen}
          markMessageRead={markMessageRead}
          renderMessage={(message, isMine) => (
            <MessageBody
              key={message._id}
              message={message}
              language={translate[message._id]?.language}
              translatedMessage={translate[message._id]?.translatedMessage}
              loading={
                message._id === loadMessageId || translate[message._id]?.loading
              }
              messagesContainerRef={sectionListRef}
              isMine={isMine}
              setInputValue={setInputValue}
              getTranslate={getTranslate}
              getQuickAnswer={getQuickAnswer}
              cancelQuickAnswer={getQuickAnswerCancel}
              showNotification={showNotification}
            />
          )}
        />
      )}
      sections={sections}
    />
  )
}
