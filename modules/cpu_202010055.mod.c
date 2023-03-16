#include <linux/module.h>
#define INCLUDE_VERMAGIC
#include <linux/build-salt.h>
#include <linux/elfnote-lto.h>
#include <linux/export-internal.h>
#include <linux/vermagic.h>
#include <linux/compiler.h>

BUILD_SALT;
BUILD_LTO_INFO;

MODULE_INFO(vermagic, VERMAGIC_STRING);
MODULE_INFO(name, KBUILD_MODNAME);

__visible struct module __this_module
__section(".gnu.linkonce.this_module") = {
	.name = KBUILD_MODNAME,
	.init = init_module,
#ifdef CONFIG_MODULE_UNLOAD
	.exit = cleanup_module,
#endif
	.arch = MODULE_ARCH_INIT,
};

#ifdef CONFIG_RETPOLINE
MODULE_INFO(retpoline, "Y");
#endif


static const struct modversion_info ____versions[]
__used __section("__versions") = {
	{ 0xbdfb6dbb, "__fentry__" },
	{ 0xa6893d39, "single_open" },
	{ 0x5b8239ca, "__x86_return_thunk" },
	{ 0x3e964603, "get_task_mm" },
	{ 0x9b35c3ed, "mmput" },
	{ 0xe6c49e03, "seq_printf" },
	{ 0xa2e9ed7e, "init_task" },
	{ 0x5a5a2271, "__cpu_online_mask" },
	{ 0x7b9793a2, "get_cpu_idle_time_us" },
	{ 0xb58aeaab, "kernel_cpustat" },
	{ 0x9e683f75, "__cpu_possible_mask" },
	{ 0xaa44a707, "cpumask_next" },
	{ 0x17de3d5, "nr_cpu_ids" },
	{ 0xb19a5453, "__per_cpu_offset" },
	{ 0x1234e483, "get_cpu_iowait_time_us" },
	{ 0x15ba50a6, "jiffies" },
	{ 0xc38c83b8, "mod_timer" },
	{ 0x87a21cb3, "__ubsan_handle_out_of_bounds" },
	{ 0xd0da656b, "__stack_chk_fail" },
	{ 0xc6f46339, "init_timer_key" },
	{ 0x3f1584d8, "proc_create" },
	{ 0x92997ed8, "_printk" },
	{ 0x2b68bd2f, "del_timer" },
	{ 0x5d1d6f6f, "remove_proc_entry" },
	{ 0xd51950b1, "seq_read" },
	{ 0x541a6db8, "module_layout" },
};

MODULE_INFO(depends, "");


MODULE_INFO(srcversion, "1A24FA610E4B245785750E4");
