<template>
  <div class="lvmsg-list">
    <div class="lvmsg-header">
      <div class="lvmsg-title">
        <h2>留言</h2>
        <span class="iconfont icon-liuyan1"></span>
      </div>
      <PsPagination
        v-if="pagination.total > pagination.pageSize"
        :isSmall="pagination.isSmall"
        :total="pagination.total"
        v-model:page="pagination.page"
        v-model:size="pagination.pageSize"
        @change="initData"
      />
    </div>
    <!-- 留言内容 -->
    <ul v-if="pagination.total">
      <li v-for="(levmsg, index) in levmsgs" :key="levmsg._id">
        <!-- 留言用户信息 -->
        <div class="lvmsg-item">
          <img class="lvmsg-avatar" :src="levmsg.userImg" alt="" />
          <span class="lvmsg-user">
            <a href="">{{ levmsg.name }}</a>
          </span>
        </div>
        <!-- 留言内容 -->
        <div class="lvmsg-item">
          <p class="lvmsg-content">{{ levmsg.levmsg }}</p>
          <span class="iconfont icon-dianzan_kuai">{{ levmsg.like }}</span>
          <span class="iconfont icon-dianzan_kuai"> </span>
        </div>
      </li>
    </ul>
    <!-- 没有留言了 -->
    <div v-else><p style="color: #868686">此图片还没有留言！</p></div>
    <div class="user-liuyan">
      <el-input
        class="input-text"
        v-model="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        placeholder="留言(200字以内)"
        show-word-limit
      />
      <span class="submit-btn">
        <button @click="submitLevMsg">留言</button>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
/* 留言 */
.lvmsg-list {
  width: 100%;
  height: 100%;
  padding: 10px;
  border-radius: 10px;
  overflow: hidden;
  background-color: $bgc-color1;
  .lvmsg-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .lvmsg-title {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      h2,
      .iconfont {
        margin-right: 10px;
        font-size: 18px;
        color: $text-color1;
      }
    }
  }

  ul {
    padding: 10px 0;
    border-top: 1px solid $text-color1;
    border-bottom: 1px solid $text-color1;

    li {
      width: 100%;
      margin-bottom: 20px;
      padding: 4px 5px;
      border-bottom: 1px dashed $text-color1;
      background-color: $bgc-color2;
      border-radius: 5px;
      overflow: hidden;

      span {
        color: $text-color1;
      }

      .lvmsg-item {
        white-space: pre-line;
        word-break: break-all;
        .lvmsg-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
          overflow: hidden;
        }
        .lvmsg-user {
          text-align: center;
          border-bottom: 1px solid $text-color1;

          a {
            color: $text-color2;
            font-weight: bold;
            letter-spacing: 4px;
          }
        }

        .lvmsg-type {
          color: $text-color3;
          margin: 0 5px;
          font-size: 14px;
          padding: 2px;
          background-color: $bgc-color2;
        }

        .lvmsg-content {
          line-height: 1.6em;
          letter-spacing: 1px;
          color: $text-color2;
        }
        .lvmsg-date {
          display: block;
          font-size: 14px;
          text-align: right;
        }

        .iconfont {
          margin-left: 10px;
        }
      }
    }
  }
  .user-liuyan {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: 10px;
    ::v-deep .input-text .el-textarea__inner {
      background-color: $bgc-color1;
    }
    ::v-deep .input-text .el-textarea__inner:focus {
      box-shadow: 0 0 0 1px $bgc-activity1;
    }

    .submit-btn {
      margin-top: 10px;
    }
  }
}
</style>
