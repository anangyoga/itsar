<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage :page-key="(route) => route.fullPath" />
  </div>
</template>
