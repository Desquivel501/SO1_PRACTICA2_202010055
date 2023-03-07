#include <linux/module.h>
// para usar KERN_INFO
#include <linux/kernel.h>
//Header para los macros module_init y module_exit
#include <linux/init.h>
//Header necesario porque se usara proc_fs
#include <linux/proc_fs.h>
/* for copy_from_user */
#include <asm/uaccess.h>	
/* Header para usar la lib seq_file y manejar el archivo en /proc*/
#include <linux/seq_file.h>

#include <linux/sched.h>
#include <linux/sched/signal.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Sistemas Operativos 1 - Practica 2 - Modulo CPU");
MODULE_AUTHOR("Derek Esquivel Diaz");

void dfs(struct task_struct *task, struct seq_file *archivo, int depth) {
	struct task_struct *child;
	struct list_head *list; 
	seq_printf(archivo, "Process ID: %d\t User ID: %d\t Name: %-20s State: %d\t\n",task->pid, task->cred->uid,task->comm, task->__state);
	list_for_each(list, &task->children) { 
        depth = depth + 1;

        // int j;
        // for (j = 0; j < (1 + depth); ++j) {
        //     seq_printf (archivo, " ");  /* Or putchar('#') */
        // }   
        
		child = list_entry(list, struct task_struct, sibling);
		dfs(child, archivo, depth);
	}
}

void test_tasks_init(struct seq_file *archivo)
{
    struct task_struct *task_list;
    unsigned int process_count = 0;
    for_each_process(task_list) {
        seq_printf(archivo, "Process: %-20s\t PID:[%d]\t Parent:[%d]\t State:%d\n", 
                task_list->comm, task_list->pid, task_list->parent->pid, task_list->__state);
        process_count++;    
    }
    seq_printf(archivo, "Number of processes:%u\n", process_count);
}


static int escribir(struct seq_file *archivo, void *v)
{
    int depth = 0;    
    // dfs(&init_task, archivo, depth); 
    test_tasks_init(archivo);
    return 0;
}

static int abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir, NULL);
}


static struct proc_ops operaciones =
{
    .proc_open = abrir,
    .proc_read = seq_read
};

static int _insert(void)
{   
    proc_create("cpu_202010055", 0, NULL, &operaciones);
    printk(KERN_INFO "Derek Esquivel\n");
    return 0;
}

static void _remove(void)
{
    remove_proc_entry("cpu_202010055", NULL);
    printk(KERN_INFO "Primer Semestre 2023\n");
    
}

module_init(_insert);
module_exit(_remove);