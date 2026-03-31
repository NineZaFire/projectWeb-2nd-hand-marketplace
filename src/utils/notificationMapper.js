const { toAbsoluteUrl } = require("./orderMapper");

const safeText = (value) => `${value ?? ""}`.trim();

const mapNotificationTarget = (target = {}) => ({
  route: safeText(target?.route),
  params: target?.params && typeof target.params === "object" ? target.params : {},
});

const normalizeMetadata = (metadata = {}, baseUrl = "") => {
  if (!metadata || typeof metadata !== "object") return {};

  const nextMetadata = { ...metadata };
  if (nextMetadata.imageUrl) {
    nextMetadata.imageUrl = toAbsoluteUrl(nextMetadata.imageUrl, baseUrl);
  }
  if (nextMetadata.avatarUrl) {
    nextMetadata.avatarUrl = toAbsoluteUrl(nextMetadata.avatarUrl, baseUrl);
  }

  return nextMetadata;
};

const mapNotification = (notification, { baseUrl } = {}) => ({
  id: notification?._id?.toString?.() ?? "",
  userId: notification?.user?.toString?.() ?? `${notification?.user ?? ""}`,
  type: safeText(notification?.type),
  title: safeText(notification?.title),
  message: safeText(notification?.message),
  target: mapNotificationTarget(notification?.target),
  metadata: normalizeMetadata(notification?.metadata, baseUrl),
  readAt: notification?.readAt ?? null,
  createdAt: notification?.createdAt ?? null,
  updatedAt: notification?.updatedAt ?? null,
  isRead: Boolean(notification?.readAt),
});

module.exports = {
  mapNotification,
};
